public with sharing class TaskItemController {
    
    //  CREATE
    @AuraEnabled
    public static TaskItem__c createTask(String title, String description, Date dueDate, Boolean isImportant) {
        TaskItem__c task = new TaskItem__c(
            Name = title,
        Description__c = description,
        Due_Date__c = dueDate,
        IsImportant__c = isImportant,
        Status__c = 'In Progress'
            
        );
        insert task;
        return task;
    }
    
    //  READ
    @AuraEnabled(cacheable=true)
    public static List<TaskItem__c> getAllTasks() {
        return [SELECT Id, Name, Description__c, Due_Date__c, IsImportant__c, Status__c FROM TaskItem__c ORDER BY CreatedDate DESC];
    }
    
    //  UPDATE
    @AuraEnabled
    public static void updateTask(TaskItem__c updatedTask) {
        update updatedTask;
    }
    
    //  DELETE
    @AuraEnabled
    public static void deleteTask(Id taskId) {
        TaskItem__c task = [SELECT Id FROM TaskItem__c WHERE Id = :taskId LIMIT 1];
        delete task;
    }
}