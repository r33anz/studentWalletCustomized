import React from "react";
import { Icon } from "../../shared/components/Icon";
import { Clipboard, ExternalLink } from "lucide-react";

export const IPFSCard = ({ ipfsHash, onCopy }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Hash IPFS del Kardex</h3>
      <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between shadow-inner">
        <span className="font-mono text-gray-600">{ipfsHash}</span>
        <div className="flex gap-2">
          <Icon icon={Clipboard} onClick={onCopy} />
          <Icon icon={ExternalLink} onClick={() => window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank")} />
        </div>
      </div>
    </div>
  )
}