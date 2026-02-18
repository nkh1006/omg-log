import { NotionAPI } from "notion-client"
import { ExtendedRecordMap } from "notion-types"

// notion-client only generates signed URLs for secure.notion-static.com URLs.
// Newer Notion uploads use an `attachment:` scheme which must be handled separately.
async function addSignedUrlsForAttachments(
  api: NotionAPI,
  recordMap: ExtendedRecordMap
) {
  const targets: { blockId: string; url: string }[] = []

  for (const blockId of Object.keys(recordMap.block)) {
    const entry = recordMap.block[blockId]
    const block = entry?.value
    if (!block) continue

    const isFileOrAudio = block.type === "file" || block.type === "audio"
    if (!isFileOrAudio) continue

    // Skip if signed URL already present
    if (recordMap.signed_urls?.[blockId]) continue

    const source: string | undefined = (block.properties as any)?.source?.[0]?.[0]
    if (source?.startsWith("attachment:")) {
      targets.push({ blockId, url: source })
    }
  }

  if (targets.length === 0) return

  try {
    const { signedUrls } = await (api as any).getSignedFileUrls(
      targets.map(({ blockId, url }) => ({
        permissionRecord: { table: "block", id: blockId },
        url,
      }))
    )

    if (signedUrls?.length === targets.length) {
      if (!recordMap.signed_urls) {
        ;(recordMap as any).signed_urls = {}
      }
      for (let i = 0; i < targets.length; i++) {
        recordMap.signed_urls[targets[i].blockId] = signedUrls[i]
      }
    }
  } catch (e) {
    console.warn("Failed to get signed URLs for attachment: blocks", e)
  }
}

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI()
  const recordMap = await api.getPage(pageId)
  await addSignedUrlsForAttachments(api, recordMap)
  return recordMap
}
