export const generateAnalysePrompt = (data: any, userMessage: string) => {
    const prompt = `
    I have a dataset in GeoJSON-like format. Each entry is a "Feature" object that includes:
    - A properties object containing a date field (formatted as "YYYY-MM") and several numeric variables (e.g., temperature, humidity, moisture, etc.).
    - A geometry field that is currently null — so no spatial analysis is required, only time-based analysis.
    Please analyze this dataset with the following goals:
    1) Identify how each numeric variable changes over time.
    2) Detect patterns or trends (e.g., increase, decrease, stability, seasonal effects).
    3) Compare the behavior of different variables over the same time period.
    4) Highlight any anomalies or sudden changes.
    5) If possible, provide visualizations like time series line plots.
    Please draft a comprehensive report based on our previous conversation and analyses. The report should NOT inlcude your own comments
    The structure of the data looks like this :
`
    const value = data // The value to convert to a JSON string
    const replacer = null // This is used to filter or modify which properties get included in the output
    const space = 2 // This tells JSON.stringify() to pretty-print the result with indentation
    let fullPrompt = `${prompt}\n${JSON.stringify(value, replacer, space)}`

    if (userMessage && userMessage.trim() !== "") {
        fullPrompt += `\n\nThe user added the following comment. Please take it into account if it’s relevant:\n"${userMessage.trim()}"`;
    }

    return fullPrompt

}