@IsTest
private class TaskItemController_Test {

    @IsTest
    static void testCreateReadUpdateDelete() {
        // --- CREATE ---
        Test.startTest();
        TaskItem__c created = TaskItemController.createTask(
            'Write unit tests',
            'Cover all controller methods',
            Date.today().addDays(3),
            true
        );
        // vérif du statut par défaut renvoyé par create
        System.assertEquals('In Progress', created.Status__c, 'Default status should be In Progress');

        // --- READ ---
        List<TaskItem__c> all = TaskItemController.getAllTasks();
        Boolean found = false;
        for (TaskItem__c t : all) {
            if (t.Id == created.Id) {
                found = true;
                break;
            }
        }
        System.assertEquals(true, found, 'Created task must be in the list');

        // --- UPDATE ---
        created.Name = 'Write awesome unit tests';
        created.Status__c = 'Done';
        TaskItemController.updateTask(created);

        TaskItem__c refreshed = [
            SELECT Id, Name, Status__c
            FROM TaskItem__c
            WHERE Id = :created.Id
            LIMIT 1
        ];
        System.assertEquals('Write awesome unit tests', refreshed.Name);
        System.assertEquals('Done', refreshed.Status__c);

        // --- DELETE ---
        TaskItemController.deleteTask(created.Id);
        Test.stopTest();

        Integer remaining = [SELECT COUNT() FROM TaskItem__c WHERE Id = :created.Id];
        System.assertEquals(0, remaining, 'Record should be deleted');
    }
}
