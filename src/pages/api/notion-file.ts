import type { NextApiRequest, NextApiResponse } from "next"
import { NotionAPI } from "notion-client"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { blockId, url } = req.query

  if (
    !blockId ||
    !url ||
    typeof blockId !== "string" ||
    typeof url !== "string" ||
    !url.startsWith("attachment:")
  ) {
    return res.status(400).end()
  }

  try {
    const api = new NotionAPI()
    const result = await (api as any).getSignedFileUrls([
      { permissionRecord: { table: "block", id: blockId }, url },
    ])

    const signedUrl = result?.signedUrls?.[0]
    if (!signedUrl) {
      return res.status(404).end()
    }

    // S3 signed URLs are valid for ~1 hour; cache this redirect for 55 minutes
    res.setHeader("Cache-Control", "private, max-age=3300")
    res.redirect(307, signedUrl)
  } catch {
    res.status(500).end()
  }
}
