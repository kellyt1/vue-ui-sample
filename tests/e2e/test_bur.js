import { Selector } from 'testcafe';

fixture `Admin: Manage Bureaus`
    .page(process.env.BASE_URL);

test('Add Bureau - Happy Path', async t => {
    await t
        .click(Selector('button').withText('Log in'))
        .typeText(Selector('#username'), process.env.STAFFING_SUPERVISOR_USERID)
        .pressKey('tab')
        .typeText(Selector('#password'), process.env.STAFFING_SUPERVISOR_PASSWORD)
        .click(Selector('#kc-login'));
    
    //staffing supervisor should see the admin menu option
    await t
        .expect(Selector('#menu_admin__BV_button_').exists).ok('Admin Button Not Present');

    await t
        .click(Selector('#menu_admin__BV_button_'))
        .click(Selector('a').withText('Manage Bureaus'))
        .click(Selector('button').withText('New Bureau'))
        .typeText(Selector('#code-input'), '12345')
        .pressKey('tab')
        .typeText(Selector('#name-input'), '2')
        .pressKey('backspace')
        .typeText(Selector('#name-input'), 'Dave ')
        .pressKey('shift+tab')
        .typeText(Selector('#code-input'), '332', {
            caretPos: 0
        })
        .pressKey('tab')
        .typeText(Selector('#name-input'), 'Dave Test', {
            caretPos: 0
        })
        .pressKey('tab')
        .typeText(Selector('#code-input'), '3')
        .pressKey('backspace')
        .typeText(Selector('#code-input'), '3')
        .click(Selector('button').withText('Save'));
});