import {orderedPlatformNames} from '../external/orderedPlatformNames';

interface ILanguageMap {
    [key: string]: string;
}

const languageMap: ILanguageMap = {
    android: 'android',
    ios: 'ios',
    java: 'java',
    js: 'javascript',
    net: '_net',
    php: 'php',
    rest: 'rest',
    ruby: 'ruby',
    ts: 'typescript'
};

export const sortCodeSamples = (codeSamples: string[]): string[] =>
    codeSamples
        .sort((codenameA, codenameB) =>
            getIndexOfLanguage(codenameA) - getIndexOfLanguage(codenameB)
        );

const getIndexOfLanguage = (codename: string): number => {
    const splitCodename = codename.split('_');
    const language = splitCodename[splitCodename.length - 1];

    return orderedPlatformNames.indexOf(languageMap[language]);
};
