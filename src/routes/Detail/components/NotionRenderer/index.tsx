import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import { useMemo } from "react"
import useScheme from "src/hooks/useScheme"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC } from "react"
import styled from "@emotion/styled"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => m.Code)
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const mapPageUrl = (id: string) => {
  return "https://www.notion.so/" + id.replace(/-/g, "")
}

const AUDIO_EXTENSIONS = [".m4a", ".mp3", ".ogg", ".wav", ".flac", ".aac"]

function isAudioUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase()
    return AUDIO_EXTENSIONS.some((ext) => pathname.endsWith(ext))
  } catch {
    return AUDIO_EXTENSIONS.some((ext) => url.toLowerCase().includes(ext))
  }
}

function convertAudioFileBlocks(
  recordMap: ExtendedRecordMap
): ExtendedRecordMap {
  const blocks = { ...recordMap.block }
  let modified = false

  for (const blockId of Object.keys(blocks)) {
    const entry = blocks[blockId]
    if (!entry?.value || entry.value.type !== "file") continue

    const source =
      recordMap.signed_urls?.[blockId] ??
      (entry.value.properties as any)?.source?.[0]?.[0]

    if (source && isAudioUrl(source)) {
      blocks[blockId] = {
        ...entry,
        value: { ...entry.value, type: "audio" as any },
      }
      modified = true
    }
  }

  return modified ? { ...recordMap, block: blocks } : recordMap
}

type Props = {
  recordMap: ExtendedRecordMap
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()
  const processedRecordMap = useMemo(
    () => convertAudioFileBlocks(recordMap),
    [recordMap]
  )
  return (
    <StyledWrapper>
      <_NotionRenderer
        darkMode={scheme === "dark"}
        recordMap={processedRecordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div`
  .notion {
    font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont,
      "Segoe UI Variable Display", "Segoe UI", Helvetica, "Apple Color Emoji",
      Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  }
  .notion-collection-page-properties {
    display: none !important;
  }
  .notion-page {
    padding: 0;
  }
  .notion-list {
    width: 100%;
  }
  .notion-quote,
  .notion-text {
    font-size: 0.9em;
  }
  .notion-hr {
    border: 1px solid var(--fg-color-0);
  }
  .notion-h2 {
    font-size: 1.25em;
  }
  .notion-h3 {
    font-size: 1.05em;
  }
`
