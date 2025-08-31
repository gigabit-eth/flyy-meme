import { useState } from "react";

const navigation = [
  {
    name: "Telegram",
    href: "https://t.me/+wESHxpHS14E3OGUx",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M21.936 2.444a2.47 2.47 0 0 0-2.506-.207L1.942 11.449c-1.312.691-1.235 2.581.116 3.19.289.13.541.228.738.282l2.144.536a2.72 2.72 0 0 0 2.167-.375l9.088-6.979a.5.5 0 0 1 .673.059c.176.19.176.483.001.675l-6.544 7.169a1.3 1.3 0 0 0-.384 1.065c.043.389.257.732.587.942l.035.018 7.945 3.783a1.958 1.958 0 0 0 2.788-1.556l1.691-15.531a2.46 2.46 0 0 0-1.051-2.283" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/flyycto/",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/i/communities/1961528861188891070",
    target: "_blank",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  // {
  //   name: "TikTok",
  //   href: "https://www.tiktok.com/@flyycto",
  //   icon: (props: React.SVGProps<SVGSVGElement>) => (
  //     <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
  //       <path d="M11.5 6C8.48 6 6 8.48 6 11.5v25c0 3.02 2.48 5.5 5.5 5.5h25c3.02 0 5.5-2.48 5.5-5.5v-25C42 8.48 39.52 6 36.5 6zm0 3h25c1.398 0 2.5 1.102 2.5 2.5v25c0 1.398-1.102 2.5-2.5 2.5h-25A2.48 2.48 0 0 1 9 36.5v-25C9 10.102 10.102 9 11.5 9m14.936 4.023A1.5 1.5 0 0 0 25 14.5V28c0 2.228-1.772 4-4 4s-4-1.772-4-4 1.772-4 4-4a1.5 1.5 0 1 0 0-3c-3.848 0-7 3.152-7 7s3.152 7 7 7 7-3.152 7-7v-7.664c1.268.981 2.782 1.664 4.5 1.664a1.5 1.5 0 1 0 0-3 4.477 4.477 0 0 1-4.5-4.5 1.5 1.5 0 0 0-1.564-1.477" />
  //     </svg>
  //   ),
  // },
];

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        "9eLZJUpWKHJy96yAqunc5wuGLzxHa4cUdbU9yZ5P4Sh4"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8 bg-black">
        <div className="flex justify-center gap-x-6 md:order-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="size-6" />
            </a>
          ))}
        </div>
        <p className="mt-8 text-center text-sm/6 text-gray-600 md:order-1 md:mt-0 dark:text-gray-400">
          <span className="text-white fugaz-one-regular">
            <a href="https://x.com/digitalhust1a" target="_blank">
              @digitalhustla
            </a>
          </span>
        </p>
        <p
          className="mt-4 text-center text-sm/6 text-gray-600 md:order-1 md:mt-0 dark:text-gray-400"
          onClick={handleCopyToClipboard}
          role="button"
          tabIndex={0}
          title="Click to copy donation address"
        >
          <span className="text-white font-mono cursor-pointer">
            {copied ? "COPIED!" : "9eL...4Sh4"}
          </span>{" "}
          🙏
        </p>
      </div>
    </footer>
  );
}
