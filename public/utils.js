export function insertAfter(newNode, referenceNode) {
 referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
