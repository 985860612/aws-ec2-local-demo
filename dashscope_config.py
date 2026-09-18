from urllib.parse import urlsplit


def resolve_base_url(api_host: str) -> str:
    """Accept a DashScope hostname or a complete compatible API base URL."""
    url = api_host.strip().rstrip('/')
    if '://' not in url:
        url = 'https://' + url
    parsed = urlsplit(url)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname:
        raise ValueError('apiHost 必须是接口域名或完整的 HTTP(S) API 地址')
    if not parsed.path:
        url += '/compatible-mode/v1'
    return url
