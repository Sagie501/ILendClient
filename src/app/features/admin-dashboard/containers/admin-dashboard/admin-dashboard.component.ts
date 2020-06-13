import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user/user.service';
import { User } from '../../../../core/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Leasing } from 'src/app/core/models/leasing.model';
import { LeasingService } from 'src/app/core/services/leasing/leasing.service';

@Component({
  selector: 'ile-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.less'],
})
export class AdminDashboardComponent implements OnInit {
  allUsers$: Observable<any[]> = this.userService.getAllUsers().pipe(
    map((users: User[]) => {
      return users.map(this.mapUserForDashboard);
    })
  );

  allLeasings$: Observable<any[]> = this.leasingService.getAllLeasings().pipe(
    map((leasings: Leasing[]) => {
      return leasings.map(this.mapLeasingForDashboard);
    })
  );

  constructor(
    private userService: UserService,
    private leasingService: LeasingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  mapUserForDashboard(user: User) {
    return [
      user.id,
      [user.firstName, user.lastName].join(' '),
      user.email,
      user.gender,
      new Date(user.birthDate),
      [user.street, user.city, user.country].join(', '),
    ];
  }

  mapLeasingForDashboard(leasing: Leasing) {
    return [
      // leasing.id,
      'c17fc64e-e011-4a74-8aaf-59bb4f7aa520',
      // leasing.lessee.id,
      'c17fc64e-e011-4a74-8aaf-59bb4f7aa520',
      [leasing.lessee.firstName, leasing.lessee.lastName].join(' '),
      // leasing.product.owner.id,
      'c17fc64e-e011-4a74-8aaf-59bb4f7aa520',
      [leasing.product.owner.firstName, leasing.product.owner.lastName].join(
        ' '
      ),
      // leasing.product.id,
      'c17fc64e-e011-4a74-8aaf-59bb4f7aa520',
      leasing.product.name,
      new Date(leasing.startDate),
      new Date(leasing.endDate),
      leasing.status,
    ];
  }

  removeUser(userId: string) {
    this.userService.removeUser(userId).subscribe((succeed) => {
      this.snackBar.open(
        succeed
          ? 'User removed successfully'
          : 'User could not be removed right now',
        'OK',
        {
          duration: 3000,
        }
      );
    });
  }
}
