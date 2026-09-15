<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class PurchaseOrder extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['supplier_id', 'date', 'status', 'total_amount', 'created_by'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['supplier_id', 'date', 'status', 'total_amount', 'created_by'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function receipts()
    {
        return $this->hasMany(Receipt::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
