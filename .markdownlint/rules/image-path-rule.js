// @ts-check

"use strict";

/**
 * @typedef {import('markdownlint').Rule} Rule
 * @typedef {import('markdownlint').RuleParams} RuleParams
 * @typedef {import('markdownlint').RuleOnError} RuleOnError
 */

/**
 * Zenn用カスタムルール: 画像パスは /images/ から始まる必要がある
 * @type {Rule}
 */
module.exports = {
  names: ["zenn-image-path"],
  description: "Images must use absolute path starting with /images/",
  tags: ["images"],
  function: function rule(params, onError) {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    
    params.lines.forEach((line, lineIndex) => {
      let match;
      imageRegex.lastIndex = 0; // Reset regex
      
      while ((match = imageRegex.exec(line)) !== null) {
        const imagePath = match[2];
        const lineNumber = lineIndex + 1;
        
        // 相対パス ../images/ をチェック
        if (imagePath.includes("../images/")) {
          onError({
            lineNumber: lineNumber,
            detail: `相対パス "${imagePath}" は使用できません。"/images/" から始まる絶対パスを使用してください。`,
            context: match[0],
            fixInfo: {
              lineNumber: lineNumber,
              editColumn: match.index + 1,
              deleteCount: match[0].length,
              insertText: match[0].replace("../images/", "/images/")
            }
          });
        }
        
        // images/ で始まるパスもチェック（/ がない）
        if (imagePath.startsWith("images/") && !imagePath.startsWith("/images/")) {
          onError({
            lineNumber: lineNumber,
            detail: `パス "${imagePath}" は "/images/" から始める必要があります。`,
            context: match[0],
            fixInfo: {
              lineNumber: lineNumber,
              editColumn: match.index + 1,
              deleteCount: match[0].length,
              insertText: match[0].replace(/^images\//, "/images/")
            }
          });
        }
      }
    });
  }
};
