import React from "react"
import CategorySelect from "./CategorySelect"
import styled from "@emotion/styled"
import { Emoji } from "src/components/Emoji"

type Props = {
  onSearchToggle: () => void
  isSearchOpen: boolean
}

const FeedHeader: React.FC<Props> = ({ onSearchToggle, isSearchOpen }) => {
  return (
    <StyledWrapper>
      <div className="left">
        <CategorySelect />
        <button
          className="search-btn"
          onClick={onSearchToggle}
          data-active={isSearchOpen}
        >
          <Emoji>🔎</Emoji>
        </button>
      </div>
    </StyledWrapper>
  )
}

export default FeedHeader

const StyledWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};

  > .left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    justify-content: space-between;

    > .search-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem;
      border-radius: 0.5rem;
      font-size: 1.25rem;
      color: ${({ theme }) => theme.colors.gray10};
      transition: background-color 0.15s, color 0.15s;

      :hover {
        background-color: ${({ theme }) => theme.colors.gray4};
        color: ${({ theme }) => theme.colors.gray12};
      }

      &[data-active="true"] {
        background-color: ${({ theme }) => theme.colors.gray5};
        color: ${({ theme }) => theme.colors.gray12};
      }
    }
  }
`
