import Script from "next/script";

const AGENT_ID = "agent_2801kyma62e6fvab26rsprf1knz3";

export default function VoiceAgent() {
  return (
    <>
      <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="lazyOnload" />
      <div
        dangerouslySetInnerHTML={{
          __html: `<elevenlabs-convai agent-id="${AGENT_ID}"></elevenlabs-convai>`,
        }}
      />
    </>
  );
}
