import {
  AppActionTypes,
  APP_FINISHED_LOADING,
  SET_SPORTS_IN_APP,
  SET_ROLES_IN_APP,
  OPEN_APP_MODAL,
  CLOSE_APP_MODAL
} from '../../actions/app/types';
import { Reducer } from 'redux';
import { ModalState, Sport, Role } from '../../../shared/types';

type AppState = {
  loading: boolean,
  sports: Array<Sport>,
  roles: Array<Role>,
  modal: ModalState
}

const initialState: AppState = {
  loading: true,
  sports: [],
  roles: [],
  modal: {
    isOpen: false,
    title: '',
    props: {},
  }
};

const reducer: Reducer <AppState, AppActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case APP_FINISHED_LOADING:
      return {
        ...state,
        loading: false,
      };
    case SET_SPORTS_IN_APP:
      return {
        ...state,
        sports: [
          ...state.sports,
          ...action.payload
        ]
      };
    case SET_ROLES_IN_APP:
      return {
        ...state,
        roles: action.payload,
      };
    case OPEN_APP_MODAL:
      return {
        ...state,
        modal: {
          ...state.modal,
          isOpen: true,
          title: action.payload.title,
          component: action.payload.component,
          props: action.payload.props
        }
      };
    case CLOSE_APP_MODAL: 
      return {
        ...state,
        modal: {
          ...state.modal,
          isOpen: false,
          title: '',
          props: {},
          component: undefined
        }
      }
    default:
      return state;
  }
}

export default reducer;