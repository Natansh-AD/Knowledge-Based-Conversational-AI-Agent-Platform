def tenant_document_path(tenant_id, filename):
    return f"{tenant_id}/uploads/{filename}"

def tenant_parsed_path(tenant_id, filename):
    return f"{tenant_id}/parsed/{filename}.json"

def tenant_chunks_path(tenant_id, filename):
    return f"{tenant_id}/chunks/{filename}.json"