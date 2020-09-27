const {writeLatexTable} = require('./util')

test('generates Latex table', () => {
    const testFindings = [
        {finding: 'Test 1', confidenceScore: 1, expertiseScore: 1},
        {finding: 'Test 2', confidenceScore: 1, expertiseScore: 1},
        {finding: 'Test 3', confidenceScore: 1, expertiseScore: 1}
    ]

    const expected = `
\\renewcommand\\arraystretch{1.5}%
\\begin{longtable}{|p{10cm}|p{2cm}|p{2cm}|}
\\hline
Finding  & Confidence Score & Expertise Score \\\\ \\hline
\\endhead
Test 1 & 1 & 1 \\\\ \\hline
Test 2 & 1 & 1 \\\\ \\hline
Test 3 & 1 & 1 \\\\ \\hline
\\caption{Example of Auto-wrapped multi-paged table}
\\label{tab:table1}
\\end{longtable}
`
    const actual = writeLatexTable(testFindings)

    expect(actual).toBe(expected)
})