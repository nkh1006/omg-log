import { useState } from "react"

import SearchInput from "./SearchInput"
import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import styled from "@emotion/styled"
import TagList from "./TagList"
import ContactCard from "./ContactCard"
import PostList from "./PostList"
import PinnedPosts from "./PostList/PinnedPosts"

type Props = {}

const Feed: React.FC<Props> = () => {
  const [q, setQ] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <StyledWrapper>
      <div className="mid">
        <PinnedPosts q={q} />
        <TagList />
        <FeedHeader
          onSearchToggle={() => setIsSearchOpen((v) => !v)}
          isSearchOpen={isSearchOpen}
        />
        {isSearchOpen && (
          <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
        )}
        <PostList q={q} />
        <div className="footer">
          <Footer />
        </div>
      </div>
      <div className="contact-fixed">
        <ContactCard />
      </div>
    </StyledWrapper>
  )
}

export default Feed

const StyledWrapper = styled.div`
  padding: 2rem 0;

  @media (max-width: 768px) {
    padding: 1.2rem 0 0.5rem;
  }

  > .mid {
    width: 100%;

    > .footer {
      padding-bottom: 2rem;
    }
  }

  > .contact-fixed {
    position: fixed;
    bottom: 2rem;
    left: 1.5rem;
    z-index: 100;
    width: 160px;

    @media (max-width: 1320px) {
      display: none;
    }
  }
`
