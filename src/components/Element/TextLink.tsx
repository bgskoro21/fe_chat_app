import React from "react";
import { Link } from "react-router-dom";

interface TextLinkProps {
  text: string;
  href: string;
  linkText: string;
}

const TextLink: React.FC<TextLinkProps> = ({ text, href, linkText }) => {
  return (
    <p className="text-sm text-center">
      {text}{" "}
      <Link to={href} className="text-blue-600 font-bold">
        {linkText}
      </Link>
    </p>
  );
};

export default TextLink;
