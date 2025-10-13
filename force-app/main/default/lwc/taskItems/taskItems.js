import { LightningElement, track } from 'lwc';
import getAllTasks from '@salesforce/apex/TaskItemController.getAllTasks';
import createTask from '@salesforce/apex/TaskItemController.createTask';
import updateTask from '@salesforce/apex/TaskItemController.updateTask';
import deleteTask from '@salesforce/apex/TaskItemController.deleteTask';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaskItems extends LightningElement {
  @track tasks = [];
  loading = false;
  error;

  newTitle = '';
  newDueDate = null;

  columns = [
    { label: 'Title', fieldName: 'Name', editable: true },
    { label: 'Status', fieldName: 'Status__c', type: 'text', editable: true },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date', editable: true },
    { label: 'Important', fieldName: 'IsImportant__c', type: 'boolean', editable: true },
    {
      type: 'action',
      typeAttributes: { rowActions: [{ label: 'Save', name: 'save' }, { label: 'Delete', name: 'delete' }] }
    }
  ];

  connectedCallback() {
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    try {
      this.tasks = await getAllTasks();
      this.error = undefined;
    } catch (e) {
      this.error = e?.body?.message || e.message;
    } finally {
      this.loading = false;
    }
  }

  handleTitleChange(e) { this.newTitle = e.target.value; }
  handleDueDateChange(e) { this.newDueDate = e.target.value; }

  async create() {
    if (!this.newTitle) {
      this.toast('Please enter a title', 'warning');
      return;
    }
    try {
      this.loading = true;
      await createTask({ title: this.newTitle, description: '', dueDate: this.newDueDate, isImportant: false });
      this.newTitle = ''; this.newDueDate = null;
      this.toast('Task created', 'success');
      await this.refresh();
    } catch (e) {
      this.toast(this.firstErr(e), 'error');
    } finally {
      this.loading = false;
    }
  }

  async handleRowAction(event) {
    const { action, row } = event.detail;
    if (action.name === 'delete') {
      await this.remove(row);
    } else if (action.name === 'save') {
      await this.save(row);
    }
  }

  async save(row) {
    try {
      this.loading = true;
      await updateTask({ updatedTask: row });
      this.toast('Task updated', 'success');
      await this.refresh();
    } catch (e) {
      this.toast(this.firstErr(e), 'error');
    } finally {
      this.loading = false;
    }
  }

  async remove(row) {
    try {
      this.loading = true;
      await deleteTask({ taskId: row.Id });
      this.toast('Task deleted', 'success');
      await this.refresh();
    } catch (e) {
      this.toast(this.firstErr(e), 'error');
    } finally {
      this.loading = false;
    }
  }

  toast(message, variant) {
    this.dispatchEvent(new ShowToastEvent({ title: 'Task Items', message, variant }));
  }

  firstErr(e) { return e?.body?.message || e.message || 'Unexpected error'; }
}
