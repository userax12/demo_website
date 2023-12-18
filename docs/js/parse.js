function parse(line) {
    if (!line || !line.length) {
        return "";
    }
    let parsedLine = "";
    // <span color=red>text</span>
    // 1    2         3    4     5
    // 1 labelOpen
    // 2 labelOpenFirstSpace
    // 3 labelOpenEnd
    // 4 labelClose
    // 5 labelCloseEnd
    for (i = 0; i < line.length; ++i) {
        if (line[i] == "<") {
            // 1 labelOpen
            let j = i + 1;
            let labelInfo = {
                "labelOpen": i
            };
            // 2 labelOpenFirstSpace
            for (;j < line.length; ++j) {
                if (line[j] == ">") {
                    break;
                }
                if (line[j] == " ") {
                    labelInfo["labelOpenFirstSpace"] = j;
                }
            }
            // 3 labelOpenEnd
            for (;j < line.length; ++j) {
                if (line[j] == ">") {
                    labelInfo["labelOpenEnd"] = j;
                }
            }
            // 4 labelClose
            for (;j < line.length; ++j) {
                if (line[j] == "<" && line[j + 1] == "/") {
                    labelInfo["labelClose"] = j;
                }
            }
            // 5 labelCloseEnd
            for (;j < line.length; ++j) {
                if (line[j] == ">") {
                    labelInfo["labelCloseEnd"] = j;
                }
            }
            // check
            if (labelInfo.labelOpen >= 0 &&
                labelInfo.labelOpenEnd > labelOpen &&
                labelInfo.labelClose > labelInfo.labelOpenEnd &&
                labelInfo.labelCloseEnd > labelInfo.labelClose) {
                    i = j;
                    if (labelInfo.labelOpen + 1 < labelOpenEnd) {
                        labelInfo.tagName = line.substring(labelInfo.labelOpen + 1, labelInfo.labelOpenEnd);
                    } else {
                        labelInfo.tagName = "";
                    }
                    if (labelInfo.labelOpenFirstSpace && labelInfo.labelOpenFirstSpace < labelInfo.labelOpenEnd) {
                        labelInfo.ogAttributes = line.substring(labelInfo.labelOpenFirstSpace + 1, labelInfo.labelOpenEnd).split(" ");
                        for (let i in labelInfo.ogAttributes) {
                            const pair = labelInfo.ogAttributes[i].split["="];
                            labelInfo.attributes[i] = {
                                "key": pair[0],
                                "value": pair[1]
                            };
                        }
                        let styleValue = "";
                        for (let attribute of labelInfo.attributes) {
                            if (attribute.key == "color") {
                                styleValue += "color:" + attribute.value + ";";
                            }
                        }
                        labelInfo.attributesLine = "";
                        if (styleValue.length) {
                            labelInfo.attributesLine += "style=\"" + styleValue + "\"";
                        }
                    }
                    if (labelInfo.labelOpenEnd + 1 < labelInfo.labelClose) {
                        labelInfo.innerText = line.substring(labelInfo.labelOpenEnd + 1, labelInfo.labelClose);
                    } else {
                        labelInfo.innerText = "";
                    }
                    parsedLine += "<" + labelInfo.tagName + " " + labelInfo.attributesLine + ">" + labelInfo.innerText + "</" + labelInfo.tagName + ">";
            } else {
                parsedLine += line[i];
            }
        } else {
            parsedLine += line[i];
        }
    }
    return parsedLine;
}