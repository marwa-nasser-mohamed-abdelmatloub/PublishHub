const ChangeTracker = ({ oldContent, newContent }) => {
  const getChanges = () => {
    const oldWords = oldContent.split(/\s+/);
    const newWords = newContent.split(/\s+/);
    const changes = [];

    let oldIndex = 0;
    let newIndex = 0;

    while (oldIndex < oldWords.length || newIndex < newWords.length) {
      if (oldIndex >= oldWords.length) {
        changes.push({
          type: "added",
          text: newWords[newIndex],
          index: newIndex,
        });
        newIndex++;
      } else if (newIndex >= newWords.length) {
        changes.push({
          type: "removed",
          text: oldWords[oldIndex],
          index: oldIndex,
        });
        oldIndex++;
      } else if (oldWords[oldIndex] === newWords[newIndex]) {
        oldIndex++;
        newIndex++;
      } else {
        if (
          oldIndex + 1 < oldWords.length &&
          oldWords[oldIndex + 1] === newWords[newIndex]
        ) {
          changes.push({
            type: "removed",
            text: oldWords[oldIndex],
            index: oldIndex,
          });
          oldIndex++;
        } else if (
          newIndex + 1 < newWords.length &&
          newWords[newIndex + 1] === oldWords[oldIndex]
        ) {
          changes.push({
            type: "added",
            text: newWords[newIndex],
            index: newIndex,
          });
          newIndex++;
        } else {
          changes.push({
            type: "modified",
            oldText: oldWords[oldIndex],
            newText: newWords[newIndex],
            index: oldIndex,
          });
          oldIndex++;
          newIndex++;
        }
      }
    }

    return changes;
  };

  const changes = getChanges();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-800 mb-2">Old Version</h4>
          <div className="text-sm text-gray-700 bg-white p-3 rounded">
            {oldContent.split(/\s+/).map((word, idx) => (
              <span
                key={idx}
                className={
                  changes.some((c) => c.type === "removed" && c.index === idx)
                    ? "bg-red-300 line-through"
                    : changes.some(
                          (c) => c.type === "modified" && c.index === idx,
                        )
                      ? "bg-orange-300"
                      : ""
                }
              >
                {word}{" "}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">New Version</h4>
          <div className="text-sm text-gray-700 bg-white p-3 rounded">
            {newContent.split(/\s+/).map((word, idx) => (
              <span
                key={idx}
                className={
                  changes.some((c) => c.type === "added" && c.index === idx)
                    ? "bg-green-300 underline"
                    : changes.some(
                          (c) => c.type === "modified" && c.index === idx,
                        )
                      ? "bg-orange-300"
                      : ""
                }
              >
                {word}{" "}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Changes Summary</h4>
        <div className="space-y-2">
          {changes.map((change, idx) => (
            <div
              key={idx}
              className={`p-2 rounded text-sm ${
                change.type === "added"
                  ? "bg-green-100 text-green-800"
                  : change.type === "removed"
                    ? "bg-red-100 text-red-800"
                    : "bg-orange-100 text-orange-800"
              }`}
            >
              {change.type === "added" && `Added: "${change.text}"`}
              {change.type === "removed" && `Removed: "${change.text}"`}
              {change.type === "modified" &&
                `Modified: "${change.oldText}" → "${change.newText}"`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeTracker;
