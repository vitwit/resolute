import { RootState } from "@/store/store";

export const selectFilteredValidators = (state: RootState) => state.staking.filteredValidators;
export const selectSearchQuery = (state: RootState) => state.staking.searchQuery;