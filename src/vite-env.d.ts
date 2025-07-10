/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    "elevenlabs-convai": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        "agent-id": string;
        "user-name"?: string;
        "conversation-id"?: string;
        variant?: "expanded" | "compact";
        "avatar-image-url"?: string;
        "avatar-orb-color-1"?: string;
        "avatar-orb-color-2"?: string;
        "action-text"?: string;
        "start-call-text"?: string;
        "end-call-text"?: string;
        "expand-text"?: string;
        "listening-text"?: string;
        "speaking-text"?: string;
        "server-location"?: "us" | "eu";
        // Add any other documented attributes here as needed
      },
      HTMLElement
    >;
  }
}
