let modal = $('#defaultModal');
let modalBody = $('.modal-body');
let modalTitle = $('.modal-title');
let modalFooter = $('.modal-footer');

let primaryButton = $('<button type="button" class="btn btn-primary"></button>');
let dismissButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>');
let dangerButton = $('<button type="button" class="btn btn-danger"></button>');

$('#newUserLink').click(() => {
    loadAddForm();
});

$('#allUsersLink').click(() => {
    clearForm();
});

$('.userForm').find(':submit').click(() => {
    addUser();
});

$(document).ready(function(){
    viewAllUsers();
    defaultModal();
});

function defaultModal() {
    modal.modal({
        keyboard: true,
        backdrop: "static",
        show: false,
    }).on("show.bs.modal", function(event){
        let button = $(event.relatedTarget);
        let id = button.data('id');
        let action = button.data('action');
        switch(action) {
            case 'editUser':
                editUser($(this), id);
                break;
            case 'deleteUser':
                deleteUser($(this), id);
                break;
        }
    }).on('hidden.bs.modal', function(event){
        $(this).find('.modal-title').html('');
        $(this).find('.modal-body').html('');
        $(this).find('.modal-footer').html('');
    });
}

async function viewAllUsers() {
    $('#usersTable tbody').empty();
    const usersResponse = await appService.findAllUsers();
    const usersJson = usersResponse.json();
    usersJson.then(users => {
        users.forEach(user => {
            let userRow = `$(<tr>
              <th scope="row">${user.id}</th>
              <td>${user.firstName}</td>
              <td>${user.lastName}</td>
              <td>${user.age}</td>
              <td>${user.email}</td>
              <td>
                 ${user.roles.map(function(role) {
                return role['name'];
            })}
               </td>
               <td>
                  <a class="btn btn-info" data-id="${user.id}" data-action="editUser" data-toggle="modal" data-target="#defaultModal">Edit</a>
               </td>
               <td>
                  <a class="btn btn-danger" data-id="${user.id}" data-action="deleteUser" data-toggle="modal" data-target="#defaultModal">Delete</a>
               </td>
           </tr>)`;
            $('#usersTable tbody').append(userRow);
        });
    });
}

async function editUser(modal, id) {
    const userResponse = await appService.findUserById(id);
    const userJson = userResponse.json();
    const rolesResponse = await appService.findAllRoles();
    const rolesJson = rolesResponse.json();

    let idInput = `<div class="form-group text-center fw-bold">
            <label for="id">ID</label>
            <input type="text" class="form-control" id="id" name="id" disabled>
            <div class="invalid-feedback"></div>
        </div>`;

    modal.find(modalTitle).html('Edit user');
    let userFormHidden = $('.userForm:hidden')[0];
    modal.find(modalBody).html($(userFormHidden).clone());
    let userForm = modal.find('.userForm');
    userForm.find('#btnAddDiv').hide();
    modal.find(userForm.show());
    modal.find(userForm).prepend(idInput);
    modal.find(userForm.show());
    dismissButton.html('Cancel');
    modal.find(modalFooter).append(dismissButton);
    modal.find(modalFooter).append(dismissButton);
    primaryButton.prop('id', 'editUserButton');
    primaryButton.html('Edit');
    modal.find(modalFooter).append(primaryButton);

    userJson.then(user => {
        modal.find('#id').val(user.id);
        modal.find('#firstName').val(user.firstName);
        modal.find('#lastName').val(user.lastName);
        modal.find('#age').val(user.age);
        modal.find('#email').val(user.email);
        rolesJson.then(roles => {
            roles.forEach(role => {
                modal.find('#roles').append($('<option>')
                    .prop('selected', user.roles.filter(e => e.id === role.id).length)
                    .val(role.id).text(role.name));
            });
        });
    });

    $('#editUserButton').click(async function(e){
        let id = parseInt(userForm.find('#id').val());
        let firstName = userForm.find('#firstName').val().trim();
        let lastName = userForm.find('#lastName').val().trim();
        let age = userForm.find('#age').val();
        let email = userForm.find('#email').val().trim();
        let password = userForm.find('#password').val().trim();
        let roles = userForm.find('#roles').val().map(roleId => parseInt(roleId));

        let user = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        };

        const userResponse = await appService.update(user);

        if (userResponse.status == 200) {
            viewAllUsers();
            dismissButton.click();
        } else if (userResponse.status === 400) {
            userResponse.json().then(response => {
                response.errors.forEach(function (error) {
                    let field = error.split(":")[0];
                    let message = error.split(":")[1];
                    modal.find('#' + field).addClass('is-invalid');
                    modal.find('#' + field).next('.invalid-feedback').text(message);
                });
            });
        } else {
            userResponse.json().then(response => {
                let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert">
                    ${response.error}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                $('.userForm').prepend(alert);
            });
        }
    });
}

async function addUser() {
    let userForm = $('.userForm');
    let firstName = userForm.find('#firstName').val().trim();
    let lastName = userForm.find('#lastName').val().trim();
    let age = userForm.find('#age').val();
    let email = userForm.find('#email').val().trim();
    let password = userForm.find('#password').val().trim();
    let roles = userForm.find('#roles').val().map(roleId => parseInt(roleId));

    let user = {
        firstName: firstName,
        lastName: lastName,
        age: age,
        email: email,
        password: password,
        roles: roles
    };

    const userResponse = await appService.add(user);

    if (userResponse.status == 201) {
        $('#allUsersLink').addClass('active');
        $('#allUsers').addClass('show').addClass('active');
        $('#newUser').removeClass('show').removeClass('active');
        $('#newUserLink').removeClass('show').removeClass('active');
        viewAllUsers();
        clearForm();
    } else if (userResponse.status === 400) {
        userResponse.json().then(response => {
            response.errors.forEach(function (error) {
                let field = error.split(":")[0];
                let message = error.split(":")[1];
                $('#' + field).addClass('is-invalid');
                $('#' + field).next('.invalid-feedback').text(message);
            });
        });
    } else {
        userResponse.json().then(response => {
            let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert">
                    ${response.error}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
            $('.userForm').prepend(alert);
        });
    }
}

async function deleteUser(modal, id) {
    $('#roles').empty();

    const userResponse = await appService.findUserById(id);
    const userJson = userResponse.json();

    let idInput = `<div class="form-group text-center fw-bold">
            <label for="id">ID</label>
            <input type="text" class="form-control" id="id" name="id" disabled>
            <div class="invalid-feedback"></div>
        </div>`;

    modal.find(modalTitle).html('Delete user');
    let userFormHidden = $('.userForm:hidden')[0];
    modal.find(modalBody).html($(userFormHidden).clone());
    let userForm = modal.find('.userForm');
    userForm.find('#pwdDiv').hide();
    userForm.find('#btnAddDiv').hide();
    modal.find(userForm.show());
    modal.find(userForm).prepend(idInput);
    dismissButton.html('Cancel');
    modal.find(modalFooter).append(dismissButton);
    modal.find(modalFooter).append(dismissButton);
    dangerButton.prop('id', 'deleteUserButton');
    dangerButton.html('Delete');
    modal.find(modalFooter).append(dangerButton);

    userJson.then(user => {
        modal.find('#id').val(user.id);
        modal.find('#firstName').val(user.firstName)[0].disabled = true;
        modal.find('#lastName').val(user.lastName)[0].disabled = true;
        modal.find('#age').val(user.age)[0].disabled = true;
        modal.find('#email').val(user.email)[0].disabled = true;
        user.roles.forEach(role => {
            modal.find('#roles').append($('<option>')
                .val(role.id).text(role.name));
        });
    });
    modal.find('#roles').prop('disabled', 'disabled');

    $('#deleteUserButton').click(async function(e){
        const userResponse = await appService.delete(id);
        if (userResponse.status == 200) {
            viewAllUsers();
            dismissButton.click();
        }
    });
}

async function clearForm() {
    $('#roles').empty();
    $('.invalid-feedback').remove();
    $('#firstName').removeClass('is-invalid');
    $('#lastName').removeClass('is-invalid');
    $('#age').removeClass('is-invalid');
    $('#email').removeClass('is-invalid');
    $('#password').removeClass('is-invalid');
}

async function loadAddForm() {
    $('#roles').empty();

    $('#firstName').removeClass('is-invalid');
    $('#firstName').val('');
    $('#lastName').removeClass('is-invalid');
    $('#lastName').val('');
    $('#age').removeClass('is-invalid');
    $('#age').val('');
    $('#email').removeClass('is-invalid');
    $('#email').val('');
    $('#password').removeClass('is-invalid');
    $('#password').val('');

    const rolesResponse = await appService.findAllRoles();
    const rolesJson = rolesResponse.json();
    rolesJson.then(roles => {
        roles.forEach(role => {
            $('#roles').append($('<option>')
                .val(role.id).text(role.name));
        });
    });
}

const http = {
    fetch: async function(url, options = {}) {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...options,
        });

        return response;
    }
};

const appService = {
    findAllUsers: async () => {
        return await http.fetch('/api/users');
    },
    findAllRoles: async () => {
        return await http.fetch('/api/roles');
    },
    add: async (data) => {
        return await http.fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    update: async (data) => {
        return await http.fetch('/api/users', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    findUserById: async (id) => {
        return await http.fetch('/api/users/' + id);
    },
    delete: async (id) => {
        return await http.fetch('/api/users/' + id, {
            method: 'DELETE'
        });
    }
};