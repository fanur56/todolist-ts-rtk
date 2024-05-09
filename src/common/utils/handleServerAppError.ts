import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";
import { BaseResponseType } from "common/types/types";

/**
 * Обрабатывает ответ сервера при возникновении ошибок приложения.
 * Функция диспетчеризует действия для обновления состояния ошибок и состояния приложения.
 *
 * @template D Тип данных, ожидаемый в ответе от сервера.
 * @param {BaseResponseType<D>} data Объект ответа сервера, включающий статус запроса и потенциальные ошибки.
 * @param {Dispatch} dispatch Функция Redux Dispatch для изменения состояния хранилища.
 * @param {boolean} [showError=true] Флаг, указывающий нужно ли показывать сообщение об ошибке пользователю.
 */
export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    if (data.messages.length) {
      dispatch(appActions.setAppError({ error: data.messages[0] }));
    } else {
      dispatch(appActions.setAppError({ error: "Some error occurred" }));
    }
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
