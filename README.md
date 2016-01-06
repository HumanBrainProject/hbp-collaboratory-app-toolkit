# hbp-collaboratory-app-toolkit

![Build Status](https://travis-ci.org/HumanBrainProject/hbp-collaboratory-app-toolkit.svg?branch=master)

A Javascript toolkit to interface a web application with the HBP Collaboratory.

This library provides a few helper to work within the Collaboratory environment.
This library can be loaded using globals (for old school web development), as an AMD module or as an AngularJS module.

# Getting Started

## Install with Bower

```bash
bower install hbp-collaboratory-app-toolkit
```

## Manual download

You can also download a [release](https://github.com/HumanBrainProject/hbp-collaboratory-app-toolkit/releases), uncompress the archive and use the file located in the `./dist` folder.


# Development

Clone the repository using git:

```bash
git clone git@github.com:HumanBrainProject/hbp-collaboratory-app-toolkit.git
```

Setup your environment with grunt an bower:

```bash
npm install -g bower grunt-cli
```

Install this library dependencies:

```bash
npm install
bower install
```

## Contributing Code

Run the tests using the grunt command line:

```bash
grunt
```

Either fork the repository or create a feature branch in HumanBrainProject.
Once your changes are ready to be merged, create a pull request and ask for a code review before merging.
