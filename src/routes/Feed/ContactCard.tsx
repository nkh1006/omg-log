import styled from "@emotion/styled"
import React from "react"
import {
  AiOutlineHome,
  AiOutlineInstagram,
  AiOutlineMail,
} from "react-icons/ai"
import { CONFIG } from "site.config"
import { Emoji } from "src/components/Emoji"

const ContactCard: React.FC = () => {
  return (
    <>
      <StyledTitle>Contact</StyledTitle>
      <StyledWrapper>
        <a href={`https://omf.org/kr/`} rel="noreferrer" target="_blank">
          <div className="name">omf</div>
        </a>
        {CONFIG.profile.instagram && (
          <a
            href={`https://www.instagram.com/${CONFIG.profile.instagram}`}
            rel="noreferrer"
            target="_blank"
          >
            <div className="name">instagram</div>
          </a>
        )}
        {CONFIG.profile.email && (
          <a
            href={`mailto:${CONFIG.profile.email}`}
            rel="noreferrer"
            target="_blank"
            css={{ overflow: "hidden" }}
          >
            <div className="name">email</div>
          </a>
        )}
      </StyledWrapper>
    </>
  )
}

export default ContactCard

const StyledTitle = styled.p`
  margin: 0 0 4px;
  font-size: 0.85rem;
`

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  a {
    display: flex;
    color: ${({ theme }) => theme.colors.gray11};
    cursor: pointer;

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
    }
    .name {
      font-size: 0.825rem;
      line-height: 1.25rem;
    }
  }
`
