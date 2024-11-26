import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountStatus, User } from '../../models/models';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'approval-requests',
  templateUrl: './approval-requests.component.html',
  styleUrl: './approval-requests.component.scss',
})
export class ApprovalRequestsComponent {
  columns: string[] = [
    'userId',
    'userName',
    'email',
    'userType',
    'createdOn',
    'approve',
    'reject'
  ];
  users: User[] = [];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
    apiService.getUsers().subscribe({
      next: (res: User[]) => {
        console.log(res);
        this.users = res.filter(
          (r) => r.accountStatus == AccountStatus.UNAPROOVED
        );
      },
    });
  }

  approve(user: User) {
    this.apiService.approveRequest(user.id).subscribe({
      next: (res) => {
        if (res === 'approved') {
          this.snackBar.open(`Approved for ${user.id}`, 'OK');
        } else this.snackBar.open(`Not Approved`, 'OK');
      },
    });
  }
  reject(user: User) {
    
    this.apiService.rejectRequest(user.id).subscribe({
      next: (res) => {
        if (res === 'rejected') {
          this.snackBar.open(`Rejected for ${user.id}`, 'OK');
        } else this.snackBar.open(`User Rejected`, 'OK');
      },
    });

  }

}
