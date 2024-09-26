import React from "react";
import { FaInstagram } from "react-icons/fa";
import { BsGithub, BsLinkedin } from "react-icons/bs";

const Footer = () => {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <>
      <footer className="flex flex-col items-center justify-center gap-4 rounded-sm py-4 shadow-lg md:flex-row md:justify-around lg:mx-24">
        <p className="text-moss">© Designed and Developed by JafeerShaik</p>
        <div className="flex items-center justify-around">
          <a
            className="mx-4 text-moss"
            href="https://www.instagram.com/___jafeer___/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit my Instagram profile"
          >
            <FaInstagram />
          </a>
          <a
            className="mx-4 text-moss"
            href="https://github.com/jafeershaik5"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit my GitHub profile"
          >
            <BsGithub />
          </a>
          <a
            className="mx-4 text-moss"
            href="https://linkedin.com/in/jafeershaik"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit my LinkedIn profile"
          >
            <BsLinkedin />
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
