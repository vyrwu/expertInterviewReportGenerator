const {normalScores, weighedScores, findings} = require('./data.js') 

const fs = require('fs')

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

    const printLatexTable = () => sortedFindingsBySumScore.forEach(sf => console.log(`${sf.finding} & ${sf.confidenceScore} & ${sf.expertiseScore} \\\\ \\hline`))

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
        
        fs.writeFile(`./out/${nameOfReport}-sum.json`, JSON.stringify(sortedFindingsBySumScore, null, 2), () => console.log(`Report finished: ./out/${nameOfReport}-sum.json`))
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
        
        fs.writeFile(`./out/${nameOfReport}-avg.json`, JSON.stringify(sortedFindingsByAverageScore, null, 2), () => console.log(`Report finished: ./out/${nameOfReport}-avg.json`))    
    })()
}

(async () => {
    console.log('Starting...')
    generateScoredFindings('normal', findings, normalScores)
    generateScoredFindings('weighed', findings, weighedScores)
})()

// const sortedFindingsByConfidence = findingsBySumScore.sort((a, b) => {
//     const scoreSumA = a.confidenceScore
//     const scoreSumB = b.confidenceScore

//     if (scoreSumA < scoreSumB) {
//         return 1
//     }

//     if (scoreSumA > scoreSumB) {
//         return -1
//     }

//     return 0
// })

// const sortedFindingsByExpertise = findingsBySumScore.sort((a, b) => {
//     const scoreSumA = a.expertiseScore
//     const scoreSumB = b.expertiseScore

//     if (scoreSumA < scoreSumB) {
//         return 1
//     }

//     if (scoreSumA > scoreSumB) {
//         return -1
//     }

//     return 0
// })