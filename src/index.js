const {normalScores, weighedScores, findings,vendorFindings} = require('./data.js')
const {writeLatexTable} = require('./util')

const fs = require('fs')

const maxPopularity = 84

const useScoredProfiles = scores => {
    const scoredProfiles = [
        {
            displayName: "MediaAtHand",
            confidenceLevel: scores.medium,
            expertiseLevel: scores.mediumLow
        },
        {
            displayName: "IBM",
            confidenceLevel: scores.mediumLow,
            expertiseLevel: scores.low
        },
        {
            displayName: "DigitalOcean",
            confidenceLevel: scores.medium,
            expertiseLevel: scores.mediumLow
        },
        {
            displayName: "ThoughtWorks",
            confidenceLevel: scores.high,
            expertiseLevel: scores.mediumHigh
        },
        {
            displayName: "Google",
            confidenceLevel: scores.mediumHigh,
            expertiseLevel: scores.high
        },
        {
            displayName: "Tjek",
            confidenceLevel: scores.mediumHigh,
            expertiseLevel: scores.high
        },
        {
            displayName: "Microsoft",
            confidenceLevel: scores.mediumLow,
            expertiseLevel: scores.mediumLow
        }
    ]
    
    const findByDisplayName = name => {
        const availableDisplayNames = scoredProfiles.map(p => p.displayName)
        if (!availableDisplayNames.includes(name)) {
            throw new Error(`Name not found in profiles: \'${name}\'`)
        }
        return scoredProfiles.filter(p => p.displayName === name)[0]
    }

    return [scoredProfiles, findByDisplayName]
}

const generateScoredFindings = async (nameOfReport, findings, scores) => {

    const [_, findByDisplayName] = useScoredProfiles(scores)

    const sortBySumDescending = findings => findings.sort((a, b) => {
        const scoreSumA = a.confidenceScore + a.expertiseScore
        const scoreSumB = b.confidenceScore + b.expertiseScore

        if (scoreSumA < scoreSumB) {
            return 1
        }

        if (scoreSumA > scoreSumB) {
            return -1
        }

        return 0
    })

    await (async () => {
        const findingsBySumScore = findings.map(f => {
            const statedBy = f.statedBy.split(', ')
            return {
                ...f,
                confidenceScore: statedBy.reduce(((acc, cur) => {
                    const matchedProfile = findByDisplayName(cur)
                    return acc + matchedProfile.confidenceLevel
                }), 0),
                expertiseScore: statedBy.reduce(((acc, cur) => {
                    const matchedProfile = findByDisplayName(cur)
                    return acc + matchedProfile.expertiseLevel
                }), 0)
            }
        })
    
        const sortedFindingsBySumScore = sortBySumDescending(findingsBySumScore)
        
        const formattedFindings = {
            json: {
                data: JSON.stringify(sortedFindingsBySumScore, null, 2),
                path: `./out/json/${nameOfReport}-sum.json`
            },
            latex: {
                data: writeLatexTable(sortedFindingsBySumScore),
                path: `./out/latex/${nameOfReport}-sum.tex`
            }
        }
        fs.writeFile(formattedFindings.latex.path, formattedFindings.latex.data, () => console.log(`Report finished: ${formattedFindings.latex.path}`))
        fs.writeFile(formattedFindings.json.path, formattedFindings.json.data,() => console.log(`Report finished: ${formattedFindings.json.path}`))
    })()

    await (async () => {
        const findingsByAverageScore = findings.map(f => {
            const statedBy = f.statedBy.split(', ')
            return {
                ...f,
                confidenceScore: statedBy.reduce(((acc, cur) => {
                    const matchedProfile = findByDisplayName(cur)
                    return acc + matchedProfile.confidenceLevel
                }), 0) / statedBy.length,
                expertiseScore: statedBy.reduce(((acc, cur) => {
                    const matchedProfile = findByDisplayName(cur)
                    return acc + matchedProfile.expertiseLevel
                }), 0) / statedBy.length
            }
        })
    
        const sortedFindingsByAverageScore = sortBySumDescending(findingsByAverageScore)
        
        const formattedFindings = {
            json: {
                data: JSON.stringify(sortedFindingsByAverageScore, null, 2),
                path: `./out/json/${nameOfReport}-avg.json`
            },
            latex: {
                data: writeLatexTable(sortedFindingsByAverageScore),
                path: `./out/latex/${nameOfReport}-avg.tex`
            }
        }
        fs.writeFile(formattedFindings.latex.path, formattedFindings.latex.data, () => console.log(`Report finished: ${formattedFindings.latex.path}`))
        fs.writeFile(formattedFindings.json.path, formattedFindings.json.data,() => console.log(`Report finished: ${formattedFindings.json.path}`))
    })()

    await (async () => {
        const findingsByPercentaageScore = findings.map(f => {
            const statedBy = f.statedBy.split(', ')
            return {
                ...f,
                confidenceScore: statedBy.reduce(((acc, cur) => {
                    const matchedProfile = findByDisplayName(cur)
                    return acc + matchedProfile.confidenceLevel
                }), 0)* 100 / maxPopularity,
                expertiseScore: statedBy.reduce(((acc, cur) => {
                    const matchedProfile = findByDisplayName(cur)
                    return acc + matchedProfile.expertiseLevel
                }), 0) * 100 / maxPopularity
            }
        })
    
        const sortedFindingsByPercentaageScore = sortBySumDescending(findingsByPercentaageScore)
        
        const formattedFindings = {
            json: {
                data: JSON.stringify(sortedFindingsByPercentaageScore, null, 2),
                path: `./out/json/${nameOfReport}-percent.json`
            },
            latex: {
                data: writeLatexTable(sortedFindingsByPercentaageScore),
                path: `./out/latex/${nameOfReport}-percent.tex`
            }
        }
        fs.writeFile(formattedFindings.latex.path, formattedFindings.latex.data, () => console.log(`Report finished: ${formattedFindings.latex.path}`))
        fs.writeFile(formattedFindings.json.path, formattedFindings.json.data,() => console.log(`Report finished: ${formattedFindings.json.path}`))
    })()
}

(async () => {
    console.log('Starting...')
    generateScoredFindings('complexity-normal', findings, normalScores)
    generateScoredFindings('complexity-weighed', findings, weighedScores)
    generateScoredFindings('vendor-normal', vendorFindings, normalScores)
    generateScoredFindings('vendor-weighed', vendorFindings, weighedScores)
})()