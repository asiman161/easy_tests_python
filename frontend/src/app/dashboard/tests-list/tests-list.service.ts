import { Injectable } from '@angular/core';

import { Angular2TokenService } from '../../shared/api-factory/angular2-token.service';

@Injectable()
export class TestsListService {
  constructor(private _token: Angular2TokenService) {

  }

  getTasks() {
    return this._token.get('tasks/tasks-teacher/');
  }

  changeTaskVisibility(id: number, visibility: boolean) {
    return this._token.patch(`tasks/${id}/task-visibility/`, {show_task: visibility});
  }

  deleteTask(id: number) {
    return this._token.delete(`tasks/${id}/delete/`);
  }
}
