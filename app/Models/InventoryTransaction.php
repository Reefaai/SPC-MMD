<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class InventoryTransaction extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['product_id', 'warehouse_id', 'type', 'quantity', 'reference_id', 'reference_type', 'date'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['product_id', 'warehouse_id', 'type', 'quantity', 'reference_id', 'reference_type', 'date'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function reference()
    {
        return $this->morphTo();
    }
}
