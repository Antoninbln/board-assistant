/**
 * Return UniqueID (only for displaying information)
 * @return { String } Unique ID
 */
export const getUniqueId = () => `key-${Math.random().toString(36).substr(2, 9)}`;

export default { getUniqueId };