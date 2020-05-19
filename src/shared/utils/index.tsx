import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../config/redux/reducers';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
