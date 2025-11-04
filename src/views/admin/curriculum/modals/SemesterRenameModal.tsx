import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";

type SemesterRenameModalProps = { isOpen: boolean; onClose: () => void; onSave: (semesterName: string) => void; initialData: string | null; };

export function SemesterRenameModal({ isOpen, onClose, onSave, initialData }: SemesterRenameModalProps) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) setName(initialData || '');
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Semester</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="py-4">
                    <div className="space-y-2">
                        <Label htmlFor="semesterName">New Semester Name</Label>
                        <Input id="semesterName" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <DialogFooter className="pt-6">
                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}