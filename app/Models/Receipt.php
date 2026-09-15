<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Receipt extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['purchase_order_id', 'warehouse_id', 'date', 'status', 'received_by'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['purchase_order_id', 'warehouse_id', 'date', 'status', 'received_by'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function items()
    {
        return $this->hasMany(ReceiptItem::class);
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
