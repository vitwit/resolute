export const convertPaginationToParams = (pagination) => {
  let result = "";
  if (pagination === undefined || (pagination?.key === null && pagination?.limit === null) || 
  (pagination?.key === undefined && pagination?.limit === undefined)
  ) {
      return ""
  }
  if (pagination.key !== null) {
      result += `pagination.key=${encodeURIComponent(pagination.key)}`
      if (pagination.limit !== null) {
          result += `&pagination.limit=${pagination.limit}`
      }
  } else {
      if (pagination.limit !== null) {
          result += `pagination.limit=${pagination.limit}`
      }
  }

  return result
} 