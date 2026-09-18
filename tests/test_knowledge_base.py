import unittest
from unittest.mock import Mock, patch
from types import SimpleNamespace
from fastapi import FastAPI
from fastapi.testclient import TestClient
from knowledge_base import DOCS, catalog, document_context, router


class KnowledgeBaseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app = FastAPI()
        app.include_router(router)
        cls.client = TestClient(app)

    def test_every_local_document_is_reachable_from_tree(self):
        data = self.client.get('/api/knowledge').json()
        ids = {doc['id'] for doc in data['documents']}
        self.assertEqual(ids, {p.stem for p in DOCS.glob('*.md')})
        def walk(nodes):
            return {n['id'] for n in nodes if n['id']} | set().union(*(walk(n['children']) for n in nodes))
        self.assertTrue(ids <= walk(data['groups']))
        self.assertEqual(data['total'], len(ids))
        self.assertTrue(all('content' not in doc for doc in data['documents']))

    def test_detail_and_safe_lookup(self):
        result = self.client.get('/api/knowledge/documents/ec2-security-groups')
        self.assertEqual(result.status_code, 200)
        self.assertIn('安全组', result.json()['content'])
        self.assertTrue(result.json()['source_url'].endswith('/ec2-security-groups.html'))
        for doc_id in ['missing', '..%2F..%2Fweb_demo.py', 'web_demo.py']:
            self.assertEqual(self.client.get('/api/knowledge/documents/' + doc_id).status_code, 404)

    def test_search_matches_titles_and_body_and_handles_empty_results(self):
        data = self.client.get('/api/knowledge/search', params={'q': '安全组'}).json()
        self.assertIn('ec2-security-groups', {d['id'] for d in data['items']})
        self.assertGreater(data['total'], 0)
        self.assertEqual(self.client.get('/api/knowledge/search', params={'q': 'NO_SUCH_DOC_12345'}).json()['items'], [])
        self.assertEqual(self.client.get('/api/knowledge/search').json()['items'], [])
        self.assertEqual(self.client.get('/api/knowledge/search', params={'q': 'a' * 201}).status_code, 422)

    def test_chat_passes_selected_document_to_agent_and_returns_its_citation(self):
        import web_demo
        agent = Mock(return_value='测试回答')
        fake_api = SimpleNamespace(embeddings=SimpleNamespace(create=Mock(
            return_value=SimpleNamespace(data=[SimpleNamespace(embedding=[0.1])]))))
        fake_qdrant = SimpleNamespace(query_points=Mock(return_value=SimpleNamespace(points=[])))
        with patch.object(web_demo, 'new_agent', return_value=agent) as create_agent, \
             patch.object(web_demo, 'api', fake_api), \
             patch.object(web_demo, 'qdrant', fake_qdrant), \
             patch.object(web_demo, 'save_message'), \
             patch.object(web_demo, 'sessions', {}):
            client = TestClient(web_demo.app)
            response = client.post('/api/chat', json={
                'message': '解释安全组规则', 'document_id': 'ec2-security-groups'})
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertTrue(data['sources'][0]['selected'])
            self.assertIn('selected_document', agent.call_args.args[0])
            self.assertIn('入站规则控制传入到实例的流量', agent.call_args.args[0])
            self.assertTrue(data['sources'][0]['source_url'].endswith('ec2-security-groups.html'))
            client.post('/api/chat', json={'session_id': data['session_id'], 'message': '继续'})
            self.assertEqual(create_agent.call_count, 1)
            self.assertEqual(client.post('/api/chat', json={
                'message': 'test', 'document_id': '../web_demo.py'}).status_code, 404)

    def test_selected_document_context_is_bounded_and_from_document(self):
        for doc_id in ['ec2-security-groups', 'DocumentHistory']:
            context = document_context(doc_id, '安全组 SSH 规则')
            self.assertTrue(context)
            self.assertLessEqual(len(context), 22000)
            self.assertIn(context.splitlines()[2], catalog()[0][doc_id]['content'])


if __name__ == '__main__':
    unittest.main()
