| [master](https://github.com/KenticoDocs/cloud-docs-reference-preprocessor/tree/master) | [develop](https://github.com/KenticoDocs/cloud-docs-reference-preprocessor/tree/develop) |
|:---:|:---:|
| [![Build Status](https://travis-ci.com/KenticoDocs/cloud-docs-reference-preprocessor.svg?branch=master)](https://travis-ci.com/KenticoDocs/cloud-docs-reference-preprocessor/branches) [![codebeat badge](https://codebeat.co/badges/32d6f2cc-4a7b-4630-86a5-4fcb745e5f2a)](https://codebeat.co/projects/github-com-kenticodocs-cloud-docs-reference-preprocessor-master) | [![Build Status](https://travis-ci.com/KenticoDocs/cloud-docs-reference-preprocessor.svg?branch=develop)](https://travis-ci.com/KenticoDocs/cloud-docs-reference-preprocessor/branches) [![codebeat badge](https://codebeat.co/badges/00b5b236-5608-45cc-993e-0f61d21eeb5c)](https://codebeat.co/projects/github-com-kenticodocs-cloud-docs-reference-preprocessor-develop) |

# Kentico Cloud Documentation - Reference Preprocessor

Backend function for Kentico Cloud documentation portal, which utilizes [Kentico Cloud](https://app.kenticocloud.com/) as a source of its content.

The service is responsible for fetching all the content related to API Reference pages on the documentation portal, and passing it forward using [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).

## Overview
1. This project is a TypeScript Azure Functions application.
2. It reacts to [Event Grid](https://azure.microsoft.com/en-us/services/event-grid/) events (`update` and `get` endpoints).
3. The function fetches content related to API Reference pages using [JavaScript Delivery SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery).
4. The fetched content is then resolved and processed into a simplified JSON format.
4. Finally, it saves the processed data to an Azure Blob Storage, where the following API Reference services can access it.

## Setup

### Prerequisites
1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on Kentico Cloud

### Instructions
1. Open Visual Studio Code and install the prerequisites according to the [following steps](https://code.visualstudio.com/tutorials/functions-extension/getting-started).
2. Log in to Azure using the Azure Functions extension tab.
3. Clone the project repository and open it in Visual Studio Code.
4. Run `yarn install` in the terminal.
5. Set the required keys.
6. Deploy to Azure using Azure Functions extension tab, or run locally by pressing `Ctrl + F5` in Visual Studio Code.

#### Required Keys
* `KC.ProjectId` - Kentico Cloud project ID
* `KC.PreviewApiKey` - Kentico Cloud Delivery Preview API key
* `KC.SecuredApiKey` - Kentico Cloud Delivery Secured API key
* `Azure.StorageKey` - Azure Storage key
* `Azure.StorageAccountName` - Azure Storage account name
* `Azure.ContainerName` - Azure Storage container name
* `Website.URL` - Kentico Cloud documentation website URL

## Testing
* Run `yarn run test` in the terminal.

## How To Contribute
Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## Licence
All the source codes are published under MIT licence.
