import { observable, action, computed } from 'mobx';
import { FieldState } from 'formstate';
import { TodoItem } from '../../common/types';
import { getAll, add } from '../service/todoService';


class AppState {
  constructor() {
    this.loadItems();
  }

  @observable
  items: TodoItem[] = [];

  @observable
  current = new FieldState('');

  @computed
  get hasTodos() {
    return this.items.length !== 0;
  }

  @action
  async addCurrentItem() {
    if (this.current.value.trim() === '') return;
    const { id } = await add({ message: this.current.value });
    this.items.push({
      id,
      completed: false,
      message: this.current.value
    });
    this.current.onChange('');
  }

  @action
  async loadItems() {
    const { todos } = await getAll();
    this.items = todos;
  }

  @action
  async toggle(item: TodoItem) {
    item.completed = !item.completed;
    /** TODO: send to server */
  }

  @action
  async destroy(item: TodoItem) {
    this.items = this.items.filter(i => i.id !== item.id);
    /** TODO: send to server */
  }

  @observable
  editingId: string | null = null;
  @observable
  editingTodoMessage: null | FieldState<string> = null;

  @action
  setEditing(item: TodoItem) {
    this.editingId = item.id;
    this.editingTodoMessage = new FieldState(item.message);
  }

  @action
  cancelEditing() {
    this.editingId = null;
    this.editingTodoMessage = null;
  }

  @action 
  async submitEditing() {
    const todo = this.items.find(i => i.id === this.editingId);
    todo.message = this.editingTodoMessage.value;
    /** TODO: send to server */
    this.cancelEditing();
  }
}

export const appState = new AppState();
