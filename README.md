<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">

<h1 align="center">iOS Remote Builder</h1>

  <p align="center">
    Develop on Windows, build on Mac
    <!-- <br />
    <a href="https://github.com/blakeglucas/ios-remote-builder"><strong>Explore the docs »</strong></a> -->
    <br />
    <a href="https://github.com/blakeglucas/ios-remote-builder/issues">Report Bug</a>
    ·
    <a href="https://github.com/blakeglucas/ios-remote-builder/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

iOS Remote Builder allows you to build remotely on iOS by connecting to a Mac computer running [iOS Remote Build Server](https://github.com/blakeglucas/ios-remote-build-server).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- A Mac computer running `ios-remote-build-server` (see [here](https://github.com/blakeglucas/ios-remote-build-server#prerequisites))
- Node 16+
- More than three brain cells

### Installation

Install the server using the following command:

- `npm i -g ios-remote-builder`

Additionally, you can run the CLI using `npx` instead.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Run the CLI with the following command:

`ios-remote-builder` or `npx ios-remote-builder`

The CLI accepts the following arguments:

- `--host, -h` Mac remote host (URL)
- `--port, -p` Mac remote port (number); default `6969`
- `--project-dir, -d` Local React Native project directory (string); default: `'.'`
- `--dev-team-id` Apple Devlopment Team ID (uuid)
- `--provisioning-profile-file` or `--provisioning-profile-specifier`, local path to \*.mobileprovision file or UUID of preinstalled provisioning profile to use during project build
- `--export-options-plist` ExportOptions.plist file to use during project build
- `--release` Build Configuration, true for Release, false or omit for Debug (boolean)
- `--output-folder, -o` Output folder for iOS build result (string); default: `'./ios'`
- `--workspace, -w` Workspace folder to monitor for live updates to build (string)
- `--createWorkspaceIfNotExists` Whether or not to create a remote workspace folder (boolean); requires `--workspace, -w`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Known Issues

- Passing Provisioning Profile Specifier fails even if the provisioning profile is previously installed. For the time being, pass the full .mobileprovisioning file instead.

<!-- ROADMAP -->

## Roadmap

TODO

See the [open issues](https://github.com/blakeglucas/ios-remote-builder/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See the `LICENSE` file for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/blakeglucas/ios-remote-builder.svg?style=for-the-badge
[contributors-url]: https://github.com/blakeglucas/ios-remote-builder/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/blakeglucas/ios-remote-builder.svg?style=for-the-badge
[forks-url]: https://github.com/blakeglucas/ios-remote-builder/network/members
[stars-shield]: https://img.shields.io/github/stars/blakeglucas/ios-remote-builder.svg?style=for-the-badge
[stars-url]: https://github.com/blakeglucas/ios-remote-builder/stargazers
[issues-shield]: https://img.shields.io/github/issues/blakeglucas/ios-remote-builder.svg?style=for-the-badge
[issues-url]: https://github.com/blakeglucas/ios-remote-builder/issues
[license-shield]: https://img.shields.io/github/license/blakeglucas/ios-remote-builder.svg?style=for-the-badge
[license-url]: https://github.com/blakeglucas/ios-remote-builder/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/blake-lucas-56b01a16a/
