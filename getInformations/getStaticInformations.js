const { exception } = require('console')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const xmlToJson = require('xml2js').parseString

// Functions to get static information
const getStaticInfos = async () => {
    let resultData = {}

    const cpuStatic = await getCpuStatic()
    const gpuStatic = await getGpuStatic()
    const memStatic = await getMemStatic()
    const computerStatic = await getComputerInformations()
    const storageStatic = await getStaticStorage()
    resultData = ({ cpu: cpuStatic, gpu: gpuStatic, mem: memStatic, comInfo: computerStatic })

    return resultData
}

// Get static CPU-information
const getCpuStatic = async () => {
    let cpuResult = []
    try {
        // Get values
        const { err, stdout, stderr } = await exec('wmic cpu get name')

        if (err || stderr) {
            let e;
            err ? e = err : e = stderr
            throw new exception(e)
        }

        // convert into JSON
        // XML parser options
        const convertOptions = {
            explicitArray: false,
            trim: true,
        };
        cpuResult = [
            stdout
        ]
        return cpuResult
    } catch (e) {
        return ({ error: e })
    }
}

// Get Static Memory-information
const getMemStatic = async () => {
    let memResult = []
    try {
        // Get values
        const loadPercentage = await exec('wmic ComputerSystem get TotalPhysicalMemory')

        // save temporary to change the output
        let tempRes = parseInt(loadPercentage.stdout.match(/\d+/))
        memResult = [
            tempRes,
        ]
        return memResult
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

// Get Static GPU-Informations with nvidia-smi
const getGpuStatic = async () => {
    let gpuResult = [];
    try {
        // Get values
        const { err, stdout, stderr } = await exec('nvidia-smi -q -x')

        if (err || stderr) {
            let e;
            err ? e = err : e = stderr
            throw new exception(e)
        }

        // convert into JSON
        // XML parser options
        const convertOptions = {
            explicitArray: false,
            trim: true,
        };
        xmlToJson(stdout, convertOptions, (e, res) => {
            if (e) {
                throw new exception(e)
            }
            const tempRes = res.nvidia_smi_log.gpu
            gpuResult = [
                tempRes.product_name,
                tempRes.temperature.gpu_temp_max_threshold,
                tempRes.temperature.gpu_temp_slow_threshold,
                tempRes.temperature.gpu_temp_max_gpu_threshold
            ]
        })
        return gpuResult
    } catch (e) {
        return ({ error: e })
    }
}

const getComputerInformations = async () => {
    let comResult = []
    try {
        const loadInformation = await exec('systeminfo')
        let tempResult = loadInformation.stdout.split('\n')
        for (i in tempResult) {
            tempResult[i] = tempResult[i].substring(tempResult[i].indexOf(' '), tempResult[i].length)
            tempResult[i] = tempResult[i].trim()
            tempResult[i] = tempResult[i].replace('\r', '')
        }
        comResult = [
            tempResult[1],
            tempResult[2],
            tempResult[3],
            tempResult[7],
            tempResult[10],
            tempResult[14],
            tempResult[30],
            tempResult[31]
        ]

        return comResult
    } catch (e) {
        return ({ error: e })
    }
}

const getStaticStorage = async () => {
    try {
        const storageInformation = await exec('wmic diskdrive list brief /format:list')
        let storageResult = storageInformation.stdout.split('\n')
        for (i in storageResult) {
            storageResult[i] = storageResult[i].trim()
            storageResult[i] = storageResult[i].replace('\r', '')
        }
        return
    } catch (e) {
        return ({ error: e })
    }
}


module.exports = { getStaticInfos }