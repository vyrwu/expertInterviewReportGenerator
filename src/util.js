module.exports.writeLatexTable = findings => `
\\renewcommand\\arraystretch{1.5}%
\\begin{longtable}{|p{10cm}|p{2cm}|p{2cm}|}
\\hline
Finding  & Confidence Score & Expertise Score \\\\ \\hline
\\endhead
${findings.reduce((acc, cur, index) => {
    const next = acc.concat(`${cur.finding} & ${cur.confidenceScore} & ${cur.expertiseScore} \\\\ \\hline`)
    return (index !== findings.length-1)
        ?  next.concat('\n')
        : next
}, '')}
\\caption{Example of Auto-wrapped multi-paged table}
\\label{tab:table1}
\\end{longtable}
`

module.exports.printLatexTable = () => sortedFindingsBySumScore.forEach(sf => console.log(`${sf.finding} & ${sf.confidenceScore} & ${sf.expertiseScore} \\\\ \\hline`))
