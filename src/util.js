module.exports.writeLatexTable = findings => {
    // this normalizes the data before printing the table

    const findingsWithSum = findings.map(finding => {
        const sum = finding.expertiseScore + finding.confidenceScore
        return {
            ...finding,
            sum
        }
    })

    const maxSums = Math.max(...findingsWithSum.reduce((acc, cur) => [...acc, cur.sum], []))
    
    const rescaledFindings = findingsWithSum.map(finding => {
        const rescaledScore = Math.round(((finding.sum / maxSums) + Number.EPSILON) * 100) / 100
        return {
            ...finding,
            rescaledScore
        }
    })

    return `
\\renewcommand\\arraystretch{1.5}%
\\begin{longtable}{|p{10cm}|p{2cm}|p{2cm}|}
\\hline
\\textbf{Finding} & \\textbf{Final Score} \\\\ \\hline
\\endhead
${rescaledFindings.reduce((acc, cur, index) => {
    const next = acc.concat(`${cur.finding} & ${cur.rescaledScore} \\\\ \\hline`)
    return (index !== findings.length-1)
        ?  next.concat('\n')
        : next
}, '')}
\\caption{Example of Auto-wrapped multi-paged table}
\\label{tab:table1}
\\end{longtable}
`
}

module.exports.printLatexTable = () => sortedFindingsBySumScore.forEach(sf => console.log(`${sf.finding} & ${sf.confidenceScore} & ${sf.expertiseScore} & ${sf.confidenceScore+sf.expertiseScore} \\\\ \\hline`))


    
    // const sumNumbers = findingsWithSum.reduce((acc, cur) => (acc + cur.sum), 0)

    // const mean =  sumNumbers/ findingsWithSum.length
    
    // const substractor = Math.pow(sumNumbers, 2) / findingsWithSum.length

    // const sqrtSumNumbers = findingsWithSum.reduce((acc, cur) => acc + Math.pow(cur.sum, 2), 0)

    // const subs = sqrtSumNumbers - substractor

    // const variance = subs / findingsWithSum.length - 1
    
    // const stdDeviation = Math.sqrt(variance)
    
    // const normalizedFindings = findingsWithSum.map(finding => ({
    //     ...finding,
    //     zScore: (finding.sum - mean) / stdDeviation
    // }))
    