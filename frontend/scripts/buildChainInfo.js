const fs = require('fs');
const path = require('path');

function convertSnakeToCamelCase(key) {
    return key.replace(/_([a-z])/g, (match, group1) => group1.toUpperCase());
}

function convertKeysToCamelCase(data) {
    if (Array.isArray(data)) {
        return data.map(convertKeysToCamelCase);
    }

    if (typeof data === 'object' && data !== null) {
        const convertedData = {};
        for (let [key, value] of Object.entries(data)) {
            key = removeQuotesFromKey(key);
            const camelCaseKey = convertSnakeToCamelCase(key);
            convertedData[camelCaseKey] = convertKeysToCamelCase(value);
        }
        return convertedData;
    }

    return data;
}

function removeQuotesFromKey(key) {
    return key.replace(/"/g, '');
}


function generateTypeScriptCode(data, indentation = '') {
    const convertedData = convertKeysToCamelCase(data);

    const formattedData = JSON.stringify(convertedData, null, 2)
        .replace(/"([^"]+)":/g, '$1:'); // Remove quotes around keys

    return `export const networks: Network[] = ${formattedData};`;
}

const chainInfoDir = './chains';
const chainInfoFiles = fs.readdirSync(chainInfoDir);
const allChainInfo = [];

chainInfoFiles.forEach(file => {
    console.log(chainInfoDir)
    if (process.env.INCLUDE_SIMAPP === "true" && file == "simapp.json") {
        const chainInfoPath = path.join(chainInfoDir, "simapp.json");
        const chainInfo = require(path.resolve(__dirname, "..", chainInfoPath));

        allChainInfo.push(chainInfo);
    } else if (file != "simapp.json") {
        const chainInfoPath = path.join(chainInfoDir, file);
        const chainInfo = require(path.resolve(__dirname, "..", chainInfoPath));

        allChainInfo.push(chainInfo);
    }
});

const typeScriptCode = generateTypeScriptCode(allChainInfo);

const outputFilename = path.join(__dirname, "..", 'src', 'utils','chainsInfo.ts');
fs.writeFileSync(outputFilename, typeScriptCode);
