const { exception } = require('console')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const xmlToJson = require('xml2js').parseString

// Functions to get dynamic informations
const getDynamicDashboard = async () => {
    let resultData = {}

    const cpuLoadDynamic = await getCpuLoadDynamic()
    const gpuDynamic = await getGpuDynmic()
    const memDynamic = await getMemDynamic()
    resultData = ({ cpu: cpuLoadDynamic, gpu: gpuDynamic, mem: memDynamic })

    return resultData;
}
// Get dynamic CPU-information
const getCpuLoadDynamic = async () => {
    let cpuResult = [];
    try {
        // Get values
        const loadPercentage = await exec('wmic cpu get loadpercentage')

        // save temporary to change the output
        let tempRes = parseInt(loadPercentage.stdout.match(/\d+/))
        cpuResult = [
            tempRes,
        ]
        return cpuResult
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

// doesnt seem to work
// const getCpuTempDynamic = async () => {
//     let cpuResult = [];
//     try {
//         const temperature = await exec('wmic /namespace:\\root\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature')
//         console.log(temperature)
//         temperature = temperature.substring(0, temperature.indexOf('\n'))

//         cpuResult = [
//             temperature
//         ]
//         return cpuResult
//     } catch (e) {
//         return (['admin'])
//     }
// }

// Get dynamic Memory-information
const getMemDynamic = async () => {
    let memResult = []
    try {
        // Get values
        const loadPercentage = await exec('wmic OS get FreePhysicalMemory')

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

// Get dynamic GPU-Informations with nvidia-smi
const getGpuDynmic = async () => {
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
                tempRes.utilization.gpu_util,
                tempRes.temperature.gpu_temp
            ]
        })
        return gpuResult
    } catch (e) {
        return ({ error: e })
    }
}

module.exports = getDynamicDashboard