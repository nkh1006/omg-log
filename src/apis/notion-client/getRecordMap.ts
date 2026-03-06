import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"

// notion-client only generates signed URLs for secure.notion-static.com URLs.
// Newer Notion uploads use an `attachment:` scheme which must be handled separately.
// Instead of generating expiring signed URLs at build/ISR time, we store a redirect
// to our API route which generates fresh signed URLs on every request.
function addSignedUrlsForAttachments(recordMap: ExtendedRecordMap) {
  if (!recordMap.signed_urls) {
    ;(recordMap as any).signed_urls = {}
  }

  for (const blockId of Object.keys(recordMap.block)) {
    const entry = recordMap.block[blockId]
    const block = entry?.value
    if (!block) continue

    const isFileOrAudio =
      block.type === "file" || block.type === "audio" || block.type === "pdf"
    if (!isFileOrAudio) continue

    // Skip if signed URL already present (from notion-client's built-in signing)
    if (recordMap.signed_urls?.[blockId]) continue

    const source: string | undefined = (block.properties as any)?.source?.[0]?.[0]
    if (source?.startsWith("attachment:")) {
      // Store an API route URL that generates fresh signed URLs on demand.
      // This prevents audio/file errors caused by expired signed URLs in ISR cached pages.
      recordMap.signed_urls[blockId] = `/api/notion-file?blockId=${encodeURIComponent(blockId)}&url=${encodeURIComponent(source)}`
    }
  }
}

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI()
  const recordMap = await api.getPage(pageId)
  addSignedUrlsForAttachments(recordMap)
  return recordMap
}
