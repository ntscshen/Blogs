import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "ntscshen's small station",
  DESCRIPTION: "Welcome to ntscshen's small station, a portfolio and blog for developers and clients.",
  AUTHOR: "ntscshen",
}

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Work", 
    HREF: "/work", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "ntscshen@gmail.com",
    HREF: "mailto:ntscshen@gmail.com",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "ntscshen",
    HREF: "https://github.com/ntscshen/"
  },
  { 
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "ntscshen",
    HREF: "https://www.linkedin.com/in/ntscshen/",
  },
  { 
    NAME: "Twitter",
    ICON: "twitter-x",
    TEXT: "ntscshen888",
    HREF: "https://twitter.com/ntscshen888",
  },
]

