![master](https://github.com/KenticoDocs/kontent-docs-reference-preprocessor/actions/workflows/master_kcd-reference-preprocessor-live-master.yml/badge.svg)
![develop](https://github.com/KenticoDocs/kontent-docs-reference-preprocessor/actions/workflows/develop_kcd-reference-preprocessor-live-dev.yml/badge.svg)

# Kentico Kontent Documentation - Reference Preprocessor

Backend function for Kentico Kontent documentation portal, which utilizes [Kentico Kontent](https://app.kontent.ai/) as a source of its data.

The service is responsible for fetching all the content related to API Reference pages on the documentation portal, and passing it forward using [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/).

## Overview
1. This project is a TypeScript Azure Functions application.
2. It reacts to [Event Grid](https://azure.microsoft.com/en-us/services/event-grid/) events (`update` and `get` endpoints).
3. The function fetches content related to API Reference pages using [Kontent Delivery SDK for Javascript](https://github.com/Kentico/kontent-delivery-sdk-js).
4. The fetched content is then resolved and processed into a simplified JSON format.
4. Finally, it saves the processed data to an Azure Blob Storage, where the following API Reference services can access it.

## Setup

### Prerequisites
1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on Kentico Kontent

### Instructions
1. Open Visual Studio Code and install the prerequisites according to the [following steps](https://code.visualstudio.com/tutorials/functions-extension/getting-started).
2. Log in to Azure using the Azure Functions extension tab.
3. Clone the project repository and open it in Visual Studio Code.
4. Run `yarn install` in the terminal.
5. Set the required keys.
6. Deploy to Azure using Azure Functions extension tab, or run locally by pressing `Ctrl + F5` in Visual Studio Code.

#### Required Keys
* `KC.ProjectId` - Kentico Kontent project ID
* `KC.PreviewApiKey` - Kentico Kontent Delivery Preview API key
* `KC.SecuredApiKey` - Kentico Kontent Delivery Secured API key
* `Azure.StorageKey` - Azure Storage key
* `Azure.StorageAccountName` - Azure Storage account name
* `Azure.ContainerName` - Azure Storage container name
* `DocsWebsiteUrl` - Kentico Kontent documentation website URL
* `EventGrid.TriggerReferenceUpdateStarter.Endpoint` - Event Grid endpoint for [Blob Provider](https://github.com/KenticoDocs/kontent-docs-blob-provider)'s ReferenceUpdateStarter function
* `EventGrid.TriggerReferenceUpdateStarter.Key` - Event Grid topic authentication key

## Testing
* Run `yarn run test` in the terminal.

## How To Contribute
Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## Licence
All the source codes are published under MIT licence.
